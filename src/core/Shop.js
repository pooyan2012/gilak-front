import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';
import {getCategories, getFilteredProducts} from './apiCore.js';
import {prices} from './fixedPrices';
import Card from './Card';

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters: {category: [], price: []}
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResult, setFilteredResult] = useState([]);

    const init = () => {
        getCategories()
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setCategories(data);
            }
        })
    }

    useEffect(() => {
        init();
        loadFilteredResult(skip, limit, myFilters.filters);
    }, []);

    const handlePrice = value => {
        const data = prices;
        let range = [];

        for (let i in data) {
            if (data[i]._id === parseInt(value)) {
                range = data[i].priceRange;
            }
        }

        return range;
    }

    const handleFilters = (filters, filterBy) => {
        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;

        if (filterBy == 'price') {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }

        loadFilteredResult(myFilters.filters);

        setMyFilters(newFilters);
    }

    const loadFilteredResult = (newFilters) => {
        getFilteredProducts(skip, limit, newFilters)
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log(data.products);
                setFilteredResult(data.products);
                setSize(data.size);
                setSkip(0);
            }            
        });
    }

    const loadMore = () => {
        let toSkip = skip + limit;

        getFilteredProducts(toSkip, limit, myFilters.filters)
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log(data.products);
                setFilteredResult([...filteredResult, ...data.products]);
                setSize(data.size);
                setSkip(0);
            }            
        });        
    }

    const loadMoreButton = () => {
        return(
            size > 0 && size >= limit && (
                <button
                    onClick={loadMore}
                    className='btn btn-warning mb-5'>
                    Load more
                </button>
            )
        );
    }

    return(
        <Layout
            title="Shop Page"
            description="Search and find books of your choice"
            className="container-fluid">
            <div className="row">
                <div className="col-4">
                    <h4>Categories</h4>
                    <ul>
                        <Checkbox
                            categories={categories}
                            handleFilters={filters => {
                                handleFilters(filters, 'category')
                            }}/>
                    </ul>
                    <h4>Price</h4>
                    <div>
                        <RadioButton
                            prices={prices}
                            handleFilters={filters => {
                                handleFilters(filters, 'price')
                            }}/>
                    </div>                    
                </div>
                <div className='col-8'>
                    <h2 className='mb-4'>
                        Products
                    </h2>
                    <div className='row'>
                        {filteredResult.map((product, i) => (
                        <div
                            key={i}
                            className='col-4 mb-3'> 
                            <Card  product={product}/>
                        </div>
                        ))}
                    </div>
                    <hr/>
                    {loadMoreButton()}
                </div>                
            </div>
        </Layout>
    );
}

export default Shop;