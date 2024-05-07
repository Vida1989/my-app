
export const load = async ({ fetch }) => {
    const responseDelays = await fetch('http://localhost:5174/data.js')
    const dataDelays = await responseDelays.json()
    
    return {
      delays: dataDelays
    };
  }
  