import courseDb from "../data/courseSet.js";
import enrollementDb from "../data/enrollementSet.js";
import {writeFile} from 'fs/promises';
import {fileURLToPath} from "url";
import path from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const addCourse = async (req, res) => { //Add course and match it with teacher ID 
    const {title} = req.body;
    const for_id = req.id;
    if (!title || !for_id) {
        return res.sendStatus(401);
    }

    const courseId = courseDb.course.length ? courseDb.course[courseDb.course.length - 1].id + 1 : 1;
        const newCourse = {
        "id": courseId,
        "title": title,
        "teacher_id": for_id, //Get it from requiest after jwt verification
    }

    const unsortedArray = [...courseDb.course, newCourse];
    courseDb.setCourse([...unsortedArray.sort((a, b) => a - b)]);
    await writeFile(path.join(__dirname, "..", "data", "courseDb.json"), JSON.stringify(courseDb.course));
    res.sendStatus(202);
}

const getCourses = (req, res) => { //Get all courses
    res.json(courseDb.course);
}

const getCourse = (req, res) => { //Get course by ID
    const findCourse = courseDb.course.find(cour => cour.id === parseInt(req.params.id));
    if(!findCourse) return res.status(404).json(
        {"Message":"The course not found!"}
    );
    res.json(findCourse);
}

const addCourseContent = async (req, res) => { //Add disc to a course
    const { description } = req.body;

    if(!description) return res.status(400).json({ message: "Description required" });

    const findCourse = courseDb.course.find(cour => cour.id === parseInt(req.params.id));
    
    if (!findCourse) {
        return res.status(404).json({"Message":"The course not found"});
    }

    findCourse.description = description;
    await writeFile(path.join(__dirname, "..", "data", "courseDb.json"), JSON.stringify(courseDb.course));
    res.sendStatus(200);
}

const courseUpdate = async (req, res) => {
    const findCourse = courseDb.course.find(cour => (cour.id === parseInt(req.params.id)));
    if (!findCourse) {
        return res.status(404).json({"Message":"Course not found"});
    }else if(findCourse && (findCourse.teacher_id !== req.id)){
        return res.status(408).json({"Message":"You are not owner of that course"});
    }

    if (!req.body.title && !req.body.description) {
        return res.status(402).json({"Message": "Update at least one attribute"});
    }

    if (req.body.title) {
        findCourse.title = req.body.title;
    }

    if (req.body.description) {
        findCourse.description = req.body.description;
    }
    await writeFile(path.join(__dirname, "..", "data", "courseDb.json"), JSON.stringify(courseDb.course));
    res.status(200).json(findCourse);
}

const getMyCourses = (req, res) => {
    const role = req.role;
    const id = req.id;
    if (role === 2000) {
        const teacherCourse = courseDb.course.filter(
            cour => cour.teacher_id === id
        );

        if (!teacherCourse.length) {
            return res.status(404).json({
            Message: "Teacher doesn't have courses"
            });
        }

        return res.json(teacherCourse);
    }
    
    if (role === 3000) {
        const matchedCourse = enrollementDb.enrollement.filter(enr => enr.student_id === id);
        const studentCourse = matchedCourse
            .map(sc => courseDb.course.find(c => c.id === sc.course_id))
            .filter(Boolean);

        if (!studentCourse.length) {
            return res.status(404).json({
            Message: "Student doesn't have courses"
            });
        }

        res.json(studentCourse);
    }

    return res.status(403).json({ message: "Unauthorized role" });
}

export {addCourse, getCourse, getCourses, addCourseContent, courseUpdate, getMyCourses};