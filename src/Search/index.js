// Core
import React, {useState, useEffect} from 'react';

// Instruments
import './styles.css';
import { api } from '../API/REST';
import { delay } from '../instruments';

import { useDebounce } from './useDebounce';

export const Search = () => {
    const [filter, setFilter ] = useState('');
    const [countries, setCountries ] = useState([]);
    const [isFetching, setIsFetching ] = useState(false);

    console.log('filter', filter);

    const getCountries = async () => {
        setIsFetching(true);
        const filteredCountries = await api.getCountries(filter.trim());
        await delay(200);
        setCountries(filteredCountries);
        setIsFetching(false);
    };

    // make jsx injection 
    /* dangerouslySetInnerHtml */ 

    const regexp = new RegExp(filter, 'g');
    const countriesJSX = countries.map((country) => {
        const name = country.name.replace(regexp, '<span><class="highlight">${filter}</span>');
        const continent = country.continent.replace(regexp, '<span><class="highlight">${filter}</span>');

        return (
            <li> key = {country.emoji}
                <span>
                    className = 'country'
                    dangerouslySetInnerHtml = {{
                        __html: `${name}, ${continent}`,
                    }}
                </span>
                <span className = 'flag'>{country.emoji}</span>
            </li>
        );
    });

    console.log(" -> countries", countries);

    const debouncedFilter = useDebounce(filter, 200);

    useEffect(() => {
        console.log(debouncedFilter);
        getCountries();
    }, [debouncedFilter]);

    return (
        <section className = 'strange-search'>
            <span className="strange">Странный</span>
            <input 
                placeholder = "Страна или континент" 
                style = {{'--inputBorderStyle' : isFetching ? 'dashed' : 'solid'}}
                type = "text"
                value = {filter}
                onChange = { (event) => setFilter(event.target.value) }
            />
            <span className="search">поиск</span>  
            <ul>
                {countriesJSX}
            </ul>  
            <b /> 
        </section>
    );
};
