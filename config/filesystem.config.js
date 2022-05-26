module.exports = {
    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || 'storage',
    MAX_UPLOAD_FILE_SIZE: process.env.MAX_UPLOAD_FILE_SIZE || 5000000, // Size in bytes
}
