import mongoose from 'mongoose';
const DB_Name = "Mern_Blog";

const connectionDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.envMongobd}/${DB_Name}`)
        console.log(" MongoDB Connection Successfully")
    } catch (error) {
        console.log("Mongodb error",error);
    }
}

export default connectionDB;