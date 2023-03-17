import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";
import { useState, useEffect } from "react";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState ();


  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true)
      const response = await fetch(
        "https://react-372b2-default-rtdb.firebaseio.com/meals.json"
      );

      if (!response.ok){
        throw new Error('Something went wrong with fetching data!')
      }
      const responseData = await response.json();
      console.log(responseData)
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }
      setMeals(loadedMeals);
      setIsLoading(false)
      console.log(loadedMeals)
    };
    
    fetchMeals().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });
   
  }, []);

  if (isLoading){
    return(
      <section>
        <h2 style={{color: `white`, textAlign: 'center'}}>Loading Meals! Please Wait...</h2>
      </section>
    )
  }

  if (httpError) {
    return(
      <section>
        <h2 style={{color: `red`, textAlign: 'center'}}>{httpError}</h2>
      </section>
    )
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
