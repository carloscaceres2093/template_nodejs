class DoctorGetAllError extends Error {
    constructor() {
        super("Failed to retrieve doctor list")
        this.name = "DoctorGetAllError"
    }
}

class PatientGetAllError extends Error {
    constructor() {
        super("Failed to retrieve patient list")
        this.name = "PatientGetAllError"
    }
}

class DoctorCreationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "DoctorCreationError"
    }
}

class DoctorUpdateError extends Error {
    constructor() {
        super("Failed to update doctor")
        this.name = "DoctorUpdateError"
    }
}

class DoctorDeleteError extends Error {
    constructor() {
        super("Failed to delete doctor")
        this.name = "DoctorDeleteError"
    }
}
class AllAppointmentGetError extends Error {
    constructor() {
        super("Failed to get all appointments")
        this.name = "AllAppointmentGetError"
    }
}
class AppointmentUpdateError extends Error {
    constructor() {
        super("Failed to update appointment")
        this.name = "AppointmentUpdateError"
    }
}

class AppoinmentCreateError extends Error {
    constructor() {
        super("Failed to create appointment")
        this.name = "AppointmentUpdateError"
    }
}

class AppointmentDeleteError extends Error {
    constructor() {
        super("Failed to delete appointment")
        this.name = "AppointmentDeleteError"
    }
}

class PatientCreateError extends Error {
    constructor() {
        super("Failed to create patient")
        this.name = "PatientCreateError"
    }
}

class PatientUpdateError extends Error {
    constructor() {
        super("Failed to update patient")
        this.name = "PatientUpdateError"
    }
}

class PatientDeleteError extends Error {
    constructor() {
        super("Failed to delete patient")
        this.name = "PatientDeleteError"
    }
}


class RecordNotFoundError extends Error {
    constructor() {
        super("Record has not found yet")
        this.name = "RecordNotFound"
    }
}


class GetAllError extends Error {
    constructor(message: string, componentName?: string) {
        super(message)
        this.name = `${componentName}GetAllError`
    }
}

export {
    DoctorGetAllError,
    DoctorCreationError,
    RecordNotFoundError,
    DoctorUpdateError,
    DoctorDeleteError,
    PatientGetAllError,
    GetAllError,
    AppointmentUpdateError,
    AppoinmentCreateError,
    AllAppointmentGetError,
    PatientCreateError,
    PatientUpdateError,
    PatientDeleteError,
    AppointmentDeleteError
}