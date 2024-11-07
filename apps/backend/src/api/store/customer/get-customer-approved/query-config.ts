/* Company Query Config */
export const approvedFields = [
    "user_id",
    "approved",
  ];
  
  export const approvedQueryConfig = {
    list: {
      defaults: approvedFields,
      isList: true,
    },
    retrieve: {
      defaults: approvedFields,
      isList: false,
    },
  };
  
  