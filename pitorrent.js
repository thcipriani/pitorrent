var peerflix = require('peerflix'),
    readTorrent = require('read-torrent'),
    path = require('path'),
    tempDir = require('os').tmpdir(),
    crypto = require('crypto'),
    omx = require('omxctrl'),
    md5sum,
    createTmpFile;

md5sum = function(torrentName) {
    return crypto
       .createHash('md5')
       .update(torrentName)
       .digest('hex');
};

createTmpFile = function(torrentName) {
    return path.join(
        tempDir,
       'pitorrent_' + md5sum(torrentName)
    );
};

module.exports = function(magnet) {
    readTorrent(magnet, function(err, torrent) {
        if (err)
            return 'torrent link could not be parsed';

        var tmpPath = createTmpFile(magnet)

        console.log(
           'Downloading ' +
           torrent.name +
           ' to ' +
           tmpPath
        );

        engine = peerflix(torrent, {
            connections: 100,
            path: tmpPath,
            // Download 2MiB then stream it
            buffer: (2 * 1024 * 1024).toString()
        });

        engine.server.on('listening', function() {
            omx.play('http://127.0.0.1:' + engine.server.address().port + '/');
        });
    });
};
