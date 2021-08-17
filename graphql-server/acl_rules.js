module.exports = {
  aclRules: [
    //administrator role permission
    {
      roles: "administrator",
      allows: [
        {
          resources: ["role", "user", "role_to_user"],
          permissions: "*",
        },
      ],
    },

    // model and adapter permissions
    {
      roles: "editor",
      allows: [
        {
          resources: [
            "local_book",
            "local_capital",
            "local_country",
            "local_publisher",
            "book",
            "capital",
            "country",
            "publisher",
            "book_instance1",
            "book_instance2",
            "capital_instance1",
            "capital_instance2",
            "country_instance1",
            "country_instance2",
            "publisher_instance1",
            "publisher_instance2",
          ],
          permissions: ["create", "update", "delete", "search"],
        },
      ],
    },

    {
      roles: "reader",
      allows: [
        {
          resources: [
            "local_book",
            "local_capital",
            "local_country",
            "local_publisher",
            "book",
            "capital",
            "country",
            "publisher",
            "book_instance1",
            "book_instance2",
            "capital_instance1",
            "capital_instance2",
            "country_instance1",
            "country_instance2",
            "publisher_instance1",
            "publisher_instance2",
          ],
          permissions: ["read"],
        },
      ],
    },
  ],
};
