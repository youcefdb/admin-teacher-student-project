import data from '/Users/youcefdabouz/Desktop/Proj/data/userDb.json' with {type: "json"};

const userDb = {
    user: data,
    setUser: function(val){
        this.user = val
    }
}

export default userDb