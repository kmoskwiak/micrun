class fsMock {
    /**
     * 
     * @param {Object} fileSystem structure representing filesystem, eg.:
     * 

     {  
        name: '/home/user',
        content: [
         {
             name: 'Photos',
             isDir: true,
             content: [
                 {
                     name: 'Cats',
                     isDir: true,
                     content: []
                 },
                 {
                     name: 'my_dashound.jpg'
                 }
             ]
         },
         {
             name: 'notes.txt'
         }
     ]
    }

     *  
     */
    constructor(fileSystem) {
        this.fileSystem = {};
        listFilesInDir(fileSystem.content, fileSystem.name + '/', this.fileSystem);
        this.fileSystem[fileSystem.name] = fileSystem;
    }

    readdirSync(directory) {
        let files = [];
        files = Object.keys(this.fileSystem).map((filePath) => {
            if(filePath.indexOf(directory + '/') === 0) {
                let trimStr = directory + '/';
                filePath = filePath.slice(trimStr.length);

                if(filePath.indexOf('/') === -1) {
                    return filePath;
                }

                return null;
            }
        }).filter(file => file);
        return files;
    }

    _require(path) {
        return this.fileSystem[path].content;
    }
}

function listFilesInDir(content, path, list) {
    for(let node in content) {
        list[path + content[node].name] = content[node];
        if(content[node].isDir) {
            listFilesInDir(content[node].content, path + content[node].name + '/', list);
        }
    }
};

module.exports = fsMock;