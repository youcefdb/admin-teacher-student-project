import path from "path";
import courseDb from "../data/courseSet.js"
import enrollementDb from "../data/enrollementSet.js";
import {writeFile} from "fs/promises";
import {fileURLToPath} from "url";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const getCourses = (req, res) => {
    res.json(courseDb.course);
}

const enrollOnCourse = async (req, res) => {
    const findCourse = courseDb.course.find(cour => cour.id === parseInt(req.params.id));
    const studentId = req.id;

    const courseRequiest = parseInt(req.params.id);
    if (!findCourse) {
        return res.status(404).json({"Message":"The course doesn't exist"});
    }

    const courseEnrolled = enrollementDb.enrollement
        .find(enr => (enr.student_id === studentId) && (enr.course_id === courseRequiest));

    if (courseEnrolled) {
        return res.status(404).json({"Message":"You're already enrolled"});
    }

    const id = enrollementDb.enrollement[enrollementDb.enrollement.length - 1].id + 1 || 1;

    const newEnrolled = {
        "id": id,
        "student_id": studentId,
        "course_id": courseRequiest
    }

    enrollementDb.setEnrollement([...enrollementDb.enrollement, newEnrolled]);
    await writeFile(path.join(__dirname, "..", "data", "enrollementDb.json"), JSON.stringify(enrollementDb.enrollement));
    res.sendStatus(200);
}


const getMyCourses = (req, res) => {
    const studeId = req.id;
    const enrolledCourses = enrollementDb.enrollement.filter(enr => enr.student_id === studeId);
    if (enrolledCourses.length === 0) {
        res.status(404).json({"Message":"You are not enrolled on any course yet"});
    }

    res.status(200).json(enrolledCourses);
}


export {getCourses, enrollOnCourse, getMyCourses};