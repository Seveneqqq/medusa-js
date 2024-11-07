/* Company Query Config */
export const accountsFields = [
    "id",
    "company_name",
    "first_name",
    "last_name",
    "email",
    "phone",
    "has_account",
    "metadata",
    "created_at",
    "updated_at",
    "deleted_at",
    "created_by",
    "approved",
    
  ];
  
  export const accountsQueryConfig = {
    list: {
      defaults: accountsFields,
      isList: true,
    },
    retrieve: {
      defaults: accountsFields,
      isList: true,
    },
  };
  
  