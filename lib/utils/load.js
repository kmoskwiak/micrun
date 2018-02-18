module.exports = function(interfaceDir, dir, file) {
    return require(path.resolve(interfaceDir, dir, file));
}