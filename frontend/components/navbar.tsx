import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { searchRecipes } from '@/services/api';

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim() && searchQuery.length >= 2) {
                setIsSearching(true);
                try {
                    const results = await searchRecipes(searchQuery);
                    setSearchResults(results);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                }
                setIsSearching(false);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleRecipeSelect = (recipeId: number) => {
        router.push(`/recipes/${recipeId}`);
        setSearchQuery('');
        setShowResults(false);
    };

    const handleSearchBlur = () => {
        setTimeout(() => setShowResults(false), 200);
    };

    return (
        <nav className="bg-orange-200 p-4 flex justify-between items-center relative">
            <button
                onClick={() => router.push('/')}
                className="bg-white rounded-full px-3 py-1  text-xl font-bold hover:underline cursor-pointer"
            >
                FlavorAI
            </button>
            <div className="flex-1 max-w-md mx-8 relative">
                <input
                    type="text"
                    placeholder="Find a recipe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    onBlur={handleSearchBlur}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />

                {isSearching && (
                    <div className="absolute right-3 top-2.5">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                    </div>
                )}

                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                        {searchResults.map((recipe: any) => (
                            <div
                                key={recipe.id}
                                onClick={() => handleRecipeSelect(recipe.id)}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                                        <p className="text-sm text-gray-600">by {recipe.author.name}</p>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="text-yellow-400">★</span>
                                        <span className="ml-1">{recipe.averageRating || '0.0'}</span>
                                        <span className="ml-1">({recipe.totalRatings || 0})</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
                        <p className="text-gray-500 text-center">Nothing found</p>
                    </div>
                )}
            </div>

            <div className="flex items-center">
                {token && (
                    <Link href="/my-recipes">
                        <button className="bg-white px-3 py-1 rounded mr-2 cursor-pointer">My Recipes</button>
                    </Link>
                )}
                {token ? (
                    <button
                        className="bg-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => {
                            localStorage.removeItem('token');
                            setToken(null);
                            location.reload();
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link href="/auth/signin">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1 rounded-md mr-2">Sign In</button>
                        </Link>
                        <Link href="/auth/signup">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold  px-3 py-1 rounded-md">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}