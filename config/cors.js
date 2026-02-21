const whiteList = [
    "www.google.com",
    "http://127.0.0.1:5500",
    "http://localhost:3500/",
];

const checkCors = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || !origin) {
            callback(null, true);
        }else{
            callback(new Error("Not Allowed"));
        }
    },
    optionsSuccessStatus: 200
}

export default checkCors; 