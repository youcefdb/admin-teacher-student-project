import data from './enrollementDb.json' with {type: "json"};

const enrollementDb = {
    enrollement: data,
    setEnrollement: function(val){
        this.enrollement = val
    }
}

export default enrollementDb;