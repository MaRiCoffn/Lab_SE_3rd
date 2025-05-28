const http = require('http');
const fs = require('fs');
const port = 3000, host = 'localhost';
const movies = require("./json/movies.json");
const html = fs.readFileSync('./views/select.html', { encoding: 'utf8' });

const filterMovies = (filters) => {
    const yearFilter = filters.year ? filters.year.split('-') : [];
    const ratingFilter = filters.rating ? filters.rating.split('-') : [];
    const genreFilter = filters.genre || '';
    const countryFilter = filters.country || '';

    return movies.filter(movie => {
        const yearCheck = yearFilter.length === 2 ? (movie.release_year >= +yearFilter[0] && movie.release_year <= +yearFilter[1]) : true;
        let ratingCheck = true;
        if (ratingFilter.length === 2) {
            ratingCheck = movie.rating >= +ratingFilter[0] && movie.rating <= +ratingFilter[1];
        } else if (ratingFilter[0] === '9') {
            ratingCheck = movie.rating === 9;
        }
        const genreCheck = genreFilter ? movie.genre === genreFilter : true;
        const countryCheck = countryFilter ? movie.country === countryFilter : true;

        return yearCheck && ratingCheck && genreCheck && countryCheck;
    });
}

const sortMovies = (movies, field, direction) => {
    return movies.sort((a, b) => {
        return direction === 'asc' ? (a[field] > b[field] ? 1 : -1) : (a[field] < b[field] ? 1 : -1);
    });
}

const sendHtml = (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    
    const filters = {
        year: queryParams.get('year'),
        rating: queryParams.get('rating'),
        genre: queryParams.get('genre'),
        country: queryParams.get('country'),
        sortYear: queryParams.get('sortYear'),
        sortRating: queryParams.get('sortRating')
    };

    let filteredMovies = filterMovies(filters);

    if (filters.sortYear) {
        filteredMovies = sortMovies(filteredMovies, 'release_year', filters.sortYear);
    }
    if (filters.sortRating) {
        filteredMovies = sortMovies(filteredMovies, 'rating', filters.sortRating);
    }

    let moviesTable = '<table><tr><th>ID</th><th>Название</th><th>Жанр</th><th>Год выхода</th><th>Рейтинг</th><th>Страна</th><th>Постер</th></tr>';
    filteredMovies.forEach(movie => {
        moviesTable += `<tr>
            <td>${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.release_year}</td>
            <td>${movie.rating}</td>
            <td>${movie.country}</td>
            <td><img src="${movie.poster}" alt="${movie.title}" style="width:100px; height:auto;"></td>
        </tr>`;
    });
    moviesTable += '</table>';

    res.end(html.replace('<!--TABLE-->', moviesTable));
}

http.createServer((req, res) => {
    if (req.url.startsWith('/')) {
        sendHtml(req, res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
}).listen(port, host, () => console.log(`http://${host}:${port}`));