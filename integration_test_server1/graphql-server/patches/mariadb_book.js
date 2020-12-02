// Delete this file, if you do not want or need any patches for the given model.

// Dear user, edit the schema to adjust it to your model
module.exports.logic_patch = function(mariadb_book) {

    // Write your patch code here
    // Hint 1: mariadb_book.prototype.function_name = function(...) {};
    // Hint 2: mariadb_book.prototype.property_name = {};

    return mariadb_book;
};