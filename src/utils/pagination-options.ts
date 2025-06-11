export const getPaginationOptions=(page, limit)=>{
    const offset = (page - 1) * limit;
    return {
        limit,
        offset
    };
};