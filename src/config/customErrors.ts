class DoctorGetAllError extends Error {
    constructor(){
        super("Failed to retrieve doctor list")
        this.name = "DoctorGetAllError"
    }
}

class DoctorCreationError extends Error {
    constructor(message: string){
        super(message)
        this.name = "DoctorCreationError"
    }
}

class RecordNotFoundError extends Error {
    constructor(){
        super("Record has not found yet")
        this.name = "RecordNotFound"
    }
}

export {
    DoctorGetAllError,
    DoctorCreationError,
    RecordNotFoundError
}