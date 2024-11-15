export const documentFields = [
    "product_id",
  ];
  
  export const documentQueryConfig = {
    list: {
      defaults: documentFields,
      isList: true,
    },
    retrieve: {
      defaults: documentFields,
      isList: false,
    },
  };
  
  