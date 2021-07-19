const {Op} =  require('sequelize');
const simple_queries = [
    {
        model: "local_book",
        options: { limit: 100, benchmark: true},
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 1000, benchmark: true},
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 5000, benchmark: true},
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 9000, benchmark: true},
        name: "local_booksConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 100, benchmark: true},
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 1000, benchmark: true},
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 5000, benchmark: true},
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 9000, benchmark: true},
        name: "local_publishersConnection"

    },
    {
        model: "local_country",
        options: { limit: 100, benchmark: true},
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 1000, benchmark: true},
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 5000, benchmark: true},
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 9000, benchmark: true},
        name: "local_countriesConnection"

    },
    {
        model: "local_capital",
        options: { limit: 100, benchmark: true},
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 1000, benchmark: true},
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 5000, benchmark: true},
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 9000, benchmark: true},
        name: "local_capitalsConnection"

    }  

];

const search_queries = [
    {
        model: "local_book",
        options: { limit: 100, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 1000, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 5000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 9000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 100, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 1000, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 5000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 9000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_country",
        options: { limit: 100, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 1000, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 5000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 9000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_capital",
        options: { limit: 100, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 1000, benchmark: true,        
            where: { name: { [Op.like]: '%43%' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 5000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 9000, benchmark: true,        
            where: { name: { [Op.like]: '%4%' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    }
];

const cursor_queries = [
    {
        model: "local_book",
        options: { limit: 100, benchmark: true,        
            where: { book_id: { [Op.gt]: 'local_bk_104496' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"
    },
    {
        model: "local_book",
        options: { limit: 1000, benchmark: true,        
            where: { book_id: { [Op.gt]: 'local_bk_104496' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 5000, benchmark: true,        
            where: { book_id: { [Op.gt]: 'local_bk_104496' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"

    },
    {
        model: "local_book",
        options: { limit: 9000, benchmark: true,        
            where: { book_id: { [Op.gt]: 'local_bk_104496' } },
            order: [ [ 'book_id', 'ASC' ] ]
        },
        name: "local_booksConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 100, benchmark: true,        
            where: { publisher_id: { [Op.gt]: 'local_pb_104496' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 1000, benchmark: true,        
            where: { publisher_id: { [Op.gt]: 'local_pb_104496' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 5000, benchmark: true,        
            where: { publisher_id: { [Op.gt]: 'local_pb_104496' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_publisher",
        options: { limit: 9000, benchmark: true,        
            where: { publisher_id: { [Op.gt]: 'local_pb_104496' } },
            order: [ [ 'publisher_id', 'ASC' ] ]
        },
        name: "local_publishersConnection"

    },
    {
        model: "local_country",
        options: { limit: 100, benchmark: true,        
            where: { country_id: { [Op.gt]: 'local_ct_104496' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 1000, benchmark: true,        
            where: { country_id: { [Op.gt]: 'local_ct_104496' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 5000, benchmark: true,        
            where: { country_id: { [Op.gt]: 'local_ct_104496' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_country",
        options: { limit: 9000, benchmark: true,        
            where: { country_id: { [Op.gt]: 'local_ct_104496' } },
            order: [ [ 'country_id', 'ASC' ] ]
        },
        name: "local_countriesConnection"

    },
    {
        model: "local_capital",
        options: { limit: 100, benchmark: true,        
            where: { capital_id: { [Op.gt]: 'local_cp_104496' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 1000, benchmark: true,        
            where: { capital_id: { [Op.gt]: 'local_cp_104496' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 5000, benchmark: true,        
            where: { capital_id: { [Op.gt]: 'local_cp_104496' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    },
    {
        model: "local_capital",
        options: { limit: 9000, benchmark: true,        
            where: { capital_id: { [Op.gt]: 'local_cp_104496' } },
            order: [ [ 'capital_id', 'ASC' ] ]
        },
        name: "local_capitalsConnection"

    }  

];


module.exports = {
    simple_queries,
    search_queries,
    cursor_queries
}
