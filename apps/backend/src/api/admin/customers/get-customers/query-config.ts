/* Company Query Config */
export const accountsFields = [
    "email",
    "approved",
    "created_at",
    "updated_at",
    "deleted_at"
  ];
  
  export const accountsQueryConfig = {
    list: {
      defaults: accountsFields,
      isList: true,
    },
    retrieve: {
      defaults: accountsFields,
      isList: false,
    },
  };
  
  