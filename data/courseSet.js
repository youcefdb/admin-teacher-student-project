import data from '/Users/youcefdabouz/Desktop/Proj/data/courseDb.json' with {type: "json"};

const courseDb = {
    course: data,
    setCourse: function(val){
        this.course = val
    }
}

export default courseDb;