import { useState } from 'react'
import './App.css'
import axios from 'axios'
import Gallery from './components/gallery'
import BackgroundAnimation from './BackgroundAnimation.jsx';
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [dogImage, setDogImage] = useState('');
  const [dogName, setDogName] = useState('');
  const [temperament, setTemperament] = useState('');
  const [lifeSpan, setLifeSpan] = useState('');
  const [breedGroup, setBreedGroup] = useState('');
  const [bannedFeatures, setBannedFeatures] = useState([]);

  const dogNames = [
    'Cooper', 'Bella', 'Maxie', 'Charlie', 'Luna', 'Lexi', 'Milo', 'Bailey', 'Daisy', 'Rosie',
    'Rocky', 'Jakey', 'Chloe', 'Coco', 'Maggie', 'Sadie', 'Lucky', 'Oliver', 'Sammy', 'Oscar',
    'Teddy', 'Winston', 'Duke', 'Pennie', 'Zoey', 'Rylie', 'Louis', 'Murphy', 'Ruby', 'Gracie',
    'Baxter', 'Dexter', 'Lilly', 'Mia', 'Stella', 'Louie', 'Hank', 'Tobias', 'Piper', 'Harley',
    'Gus', 'Milo', 'Jax', 'Roxie', 'Sasha', 'Ellie', 'Scout', 'Roscoe', 'Nala', 'Abby',
    'Lola', 'Georgie', 'Anna', 'Brucey', 'Cleo', 'Eddie', 'Izzy', 'Jackson', 'Leo', 'Olive',
    'Tucker', 'Bella', 'Marley', 'Boomer', 'Finn', 'Rudy', 'Ziggy', 'Archie', 'Beau', 'Chester', 'Brownie'
  ];
  

   const fetchRandomDogImage = () => {
    axios.get('https://api.thedogapi.com/v1/images/search', {
      headers: {
        'x-api-key': ACCESS_KEY,
      },
    })
    .then(response => {
      const breedData = response.data[0].breeds[0];
      if (!breedData || 
          !breedData.temperament || bannedFeatures.includes(breedData.temperament.split(', ')[0]) ||
          !breedData.life_span || bannedFeatures.includes(breedData.life_span) ||
          !breedData.breed_group || bannedFeatures.includes(breedData.breed_group)) {
        fetchRandomDogImage(); 
      } else {
        setDogImage(response.data[0].url);
        setDogName(dogNames[Math.floor(Math.random() * dogNames.length)]);
        setTemperament(breedData.temperament.split(', ')[0]);
        setLifeSpan(breedData.life_span);
        setBreedGroup(breedData.breed_group);
      }
    })
    .catch(error => {
      console.error('Error fetching the dog image:', error);
    });
  };

  const handleFeatureClick = (feature) => {
    if (!bannedFeatures.includes(feature)) {
      setBannedFeatures([...bannedFeatures, feature]);
    }
  };
  return (
    <div className="whole-page">
      <BackgroundAnimation />
      <div className="content">
        <h2 className="title">Chose That Dogo!</h2>
        <div className="discover-page">
          <div className="listing-container">
            {dogName && <h2 className="dog-name">{dogName}</h2>}
            {dogImage && (
              <>
                <div className="feature-buttons">
                  <button onClick={() => handleFeatureClick(temperament)}>{temperament || 'Loading...'}</button>
                  <button onClick={() => handleFeatureClick(lifeSpan)}>{lifeSpan || 'Loading...'}</button>
                  <button onClick={() => handleFeatureClick(breedGroup)}>{breedGroup || 'Loading...'}</button>
                </div>
                <br></br>
                <div className="image-container">
                  <img src={dogImage} alt="Random Dog" className="dog-image" />
                </div>
              </>
            )}
          </div>
          <button className="discover-btn" onClick={fetchRandomDogImage}>Discover Another Dog</button>
        </div>
      </div>
      <div className="sidebar">
        <h3>Banned Features</h3>
        <ul>
          {bannedFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App
