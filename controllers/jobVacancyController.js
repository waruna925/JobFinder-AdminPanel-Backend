import JobVacancy from "../models/jobVacancyModel.js";

export async function createJob(req, res) {

    try {
        const jobVacancy = new JobVacancy(
            req.body
        );

        await jobVacancy.save();
        res.status(201).send({ message: "Job Vacancy Created Successfully" });
        
    }
    catch (err) {
        res.status(500).send({ message: "Error Creating Job Vacancy", error: err });
         
    }
}

export async function getAllJobs(req, res) {
    try{
        const jobVacancy=await JobVacancy.find();
        res.status(200).json(jobVacancy);
    }
    catch(err){
        res.status(500).send({ message: "Error Fetching Job Vacancies", error: err });
    }
}

export async function getJob(req,res) {
    const jobId=req.params.id;

    try{
        const jobVacancy=await JobVacancy.findOne({jobId:jobId});

        if(jobVacancy){
            res.status(200).json(jobVacancy);
        } else {
            res.status(404).send({ message: "Job Vacancy Not Found" });
        }
    }
    catch(err){
        res.status(500).send({ message: "Error Fetching Job Vacancy", error: err });
    }
}

export async function updateJob(req,res){


    const jobId=req.params.id;
    const updatingData=req.body;

    try{
        await JobVacancy.updateOne(
            {jobId:jobId},
            updatingData
        )
        res.status(200).send({ message: "Job Vacancy Updated Successfully" });
    }
    catch(err){
        res.status(500).send({ message: "Failed to Update Job Vacancy", error: err });
    }
}

export async function activeBtn(req,res){
    const jobId=req.params.id;

    const isAvailable=req.body.isAvailable;

    try{
        const jobVacancy=await JobVacancy.findOne(
            {
                jobId:jobId
            }
        )
        if(!jobVacancy){
            return res.status(404).send({ message: "Job Vacancy Not Found" });
        }

        await JobVacancy.updateOne(
            {jobId:jobId},
            { $set: { isAvailable: isAvailable } }
        )
        res.status(200).send({ message: "Job Vacancy Status Updated Successfully" });
    }
    catch(err){
        res.status(500).send({ message: "Failed to Update Job Vacancy Status", error: err });
    }
}