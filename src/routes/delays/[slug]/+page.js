export const load = async ({ fetch, params }) => {  
    const slug = parseInt(params.slug)
    const res = await fetch('http://localhost:5174/data.js')
    const data = await res.json()
    const data_for_slug = data.filter(entry => parseInt(entry.PlantKey) === slug);

    return {
      delay: data_for_slug,
    }
  }
  