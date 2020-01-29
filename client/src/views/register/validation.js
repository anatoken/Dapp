export default function validate(values, roles) {
    let errors = {};
    switch(roles){
        case "sp":
            if(!values.serviceName){
                errors.serviceNameError = true;
            }
            break;
        default:
           return "ok";
    }
    return errors;
}