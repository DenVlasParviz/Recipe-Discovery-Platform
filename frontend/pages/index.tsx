import Navbar from '../components/navbar';
import RecipeCard from '../components/recipeCard';
import { useEffect, useState } from 'react';
import { getRecipes } from '@/services/api';
import { Recipe } from "@/types/recipe";
import { useRouter } from 'next/router';
import {useUserId} from "@/hooks/useUserId";

export default function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const router = useRouter();

    const handleClick = () => {
        if (userId) {
            router.push("/recipes/create");
        } else {
            router.push("/auth/signup");
        }
    };

    const userId = useUserId();



    useEffect(() => {
        console.log(userId)
        getRecipes().then(setRecipes);
    }, []);
    return (
        <div>
            <Navbar />
            <div className="p-4 flex justify-end">
                <button
                    onClick={handleClick}
                    className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                    Create Recipe
                </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map(recipe => {

                    return (
                        <RecipeCard
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            averageRating={recipe.averageRating}
                        />
                    );
                })}
            </div>
        </div>
    );
}
