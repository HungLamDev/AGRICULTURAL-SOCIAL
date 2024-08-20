import React, {useState} from 'react'

const Search = () => {
      const [search, setSearch] = useState('')
  return (
    <form className='search-form'>
      <input type="text" name="search" value={search} id='search'
      onChange={e => setSearch(e.target.value.toLocaleLowerCase().replace(/ /g, ''))}  
      style={{ borderRadius: '10px', border: '1px solid #ccc', padding: '3px'}} 
      />
      <div className='search_icon'>
            <span className='material-icons'>search</span>
            <span>search</span>
      </div>
      <div className='close_search'>&times;</div>
    </form>
  )
}

export default Search