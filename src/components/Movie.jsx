import { useState } from "react";

export default function Movie()
{
    const [query,setQuery]=useState("");
    const [year,setYear]=useState("");
    const [movies,setMovies]=useState([])
    const [page,setPage]=useState(1);
    const [totalResults,setTotalResults]=useState(0);


    const apikey="9165b550";
    const fetchmovies=async(pageNumber=1,searchYear=year)=>{
        const url=`http://www.omdbapi.com/?apikey=${apikey}&s=${encodeURIComponent(query)}${searchYear?`&y=${searchYear}`:""}&page=${pageNumber}`
        const response=await fetch(url);
        const data=await response.json();
        console.log(data);
        if(data.Response==="True")
        {
            setMovies(data.Search);
            setTotalResults(parseInt(data.totalResults));
        }
        else
        {
            setMovies([]);
            setTotalResults(0);
        }   
    }

    const handleYearChange=(e)=>{
        const selectedYear=e.target.value;
        setYear(selectedYear);
        setPage(1);
        fetchmovies(1,query,selectedYear);
    }

    const handlePrev=()=>{
        if(page>1){
            const newPage=page-1;
            setPage(newPage);
            fetchmovies(newPage)
        }
    }

    const handleNext=()=>{
        const maxPage=Math.ceil(totalResults/10)
        if(page<maxPage){
            const newPage=page+1;
            setPage(newPage);
            fetchmovies(newPage);
        }
    }

    const handleKey=(e)=>{
        if(e.key==="Enter")
        {
            e.preventDefault();
            setPage(1);
            fetchmovies(1);
        }
    }

    const currentYear=new Date().getFullYear();
    const years=[];
    for(let y=currentYear;y>=1980;y--)
    {
        years.push(y);
    }
    // console.log(years);
    
    return(
        <>
        <div style={{maxWidth:"800px",margin:"20px auto"}}>
            <h1 style={{textAlign:"center"}}>Movie API</h1>

            <div>
                <input type="text" style={{width:"80%",padding:"8px",marginRight:"5px"}} value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={handleKey}/>
                <select style={{padding:"8px"}} value={year} onChange={handleYearChange}>
                    <option value="">All Years</option>
                    {years.map((y)=>(
                    <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

        </div>

        {/* Movie List */}

        <div style={{maxWidth:"650px",margin:"10px auto"}}>
        {movies.map((movie)=>(
            <div key={movie.imdbID} style={{display:"flex",border:"1px solid #ccc",padding:"10px", marginBottom:"10px",borderRadius:"8px"}}> 
            <div style={{marginRight:"10px"}}>
                <img src={movie.Poster} alt={movie.Title} style={{width:"100px",height:"150px",objectFit:"cover"}} />
            </div>
            <div>
                <h3>{movie.Title}</h3>
                <p><strong>Year:</strong>{movie.Year}</p>
                <p><strong>Type:</strong>{movie.Type}</p>
            </div>
            </div>
        ))

        }

        {/* Pagination*/}
        {totalResults>10 && (
        <div style={{textAlign:"center",marginTop:"20px"}}>
            <button style={{padding:"5px 10px",marginRight:"10px"}} onClick={handlePrev}  disabled={page===1}>Previous</button>
            
            <span>Page {page} of {Math.ceil(totalResults/10)}</span>

            <button style={{padding:"5px 10px",marginRight:"10px"}} onClick={handleNext} 
            disabled={page===Math.ceil(totalResults/10)}>Next</button>
        </div>
         )}

         </div>
        </>
    )
}