export const jValidator = {
    email: (value: string) =>{
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
        {
            return (true)
        }
        return false;
    },

    password: (value: string) => {
        if(value.length < 6) return false;
        return true;
    },

    mobile: (value: any) => {
        if(value.toString().length == 10 && jValidator.isOnlyNumber(value)) return true;
        return false;
    },


    addharCard: (value: any) => {
        if(value.toString().length == 12 && jValidator.isOnlyNumber(value)) return true;
        return false;
    },

    // helping
    isOnlyNumber: (value: any) => {
        let numbers = /^[0-9]+$/;
        if(value.toString().match(numbers)) return true;
        return false;
    }
};