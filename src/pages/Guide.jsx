import { useState } from 'react';
import GeminiRecyclingService from '../components/GeminiRecyclingService';

function Guide() {
    const [formData, setFormData] = useState({
        itemName: '',
        materials: [],
        materialsOther: '',
        size: '',
        condition: '',
        plasticType: '',
        quantity: '',
        specialFeatures: '',
        userLocation: ''
    });
    const [recyclingGuidance, setRecyclingGuidance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const geminiService = new GeminiRecyclingService();

    const materialOptions = [
        'Plastic', 'Paper/Cardboard', 'Glass', 'Metal (Aluminum)', 
        'Metal (Other)', 'Electronics', 'Battery', 'Fabric/Textile', 
        'Wood', 'Rubber', 'Mixed Materials', 'Other'
    ];

    const sizeOptions = [
        'Small (fits in hand)', 'Medium (size of a book)', 
        'Large (size of a box)', 'Extra Large (furniture size)'
    ];

    const conditionOptions = [
        'Clean/New', 'Slightly dirty', 'Very dirty/contaminated', 
        'Broken but intact', 'Broken into pieces', 'Still functional'
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const handleMaterialChange = (material) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.includes(material)
                ? prev.materials.filter(m => m !== material)
                : [...prev.materials, material]
        }));
    };

    const createDetailedDescription = () => {
        const { itemName, materials, materialsOther, size, condition, plasticType, hasLabels, quantity, specialFeatures, userLocation } = formData;
        let description = `Item: ${itemName}`;
        if (materials.length > 0) {
            description += `\nMaterials: ${materials.join(', ')}`;
            if (materialsOther) {
                description += ` (${materialsOther})`;
            }}
        if (plasticType) {
            description += `\nPlastic type/recycling code: ${plasticType}`;}
        if (size) {
            description += `\nSize: ${size}`;}
        if (condition) {
            description += `\nCondition: ${condition}`;}
        if (hasLabels) {
            description += `\nRecycling labels/symbols present: ${hasLabels}`;}
        if (quantity) {
            description += `\nQuantity: ${quantity}`;}
        if (specialFeatures) {
            description += `\nSpecial features/concerns: ${specialFeatures}`;}
        if (userLocation) {
            description += `\nUser Location: ${userLocation}`;}
        console.log(description);
        return description;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setCurrentStep(5);
        if (!formData.itemName.trim()) {
            setError('Please provide the item name');
            return;
        }

        if (formData.materials.length === 0) {
            setError('Please select at least one material');
            return;
        }

        setIsLoading(true);
        setError('');
        setRecyclingGuidance(null);

        try {
            const detailedDescription = createDetailedDescription();
            const guidance = await geminiService.getRecyclingGuidance(detailedDescription);
            setRecyclingGuidance(guidance);
        } catch (err) {
            setError('Failed to get recycling guidance. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormKeyDown = (e) => {
        if (e.key !== 'Enter') return;
        if (e.target && e.target.tagName === 'TEXTAREA') return;

        if (currentStep < 4) {
            e.preventDefault();
            if (currentStep === 1 && formData.itemName.trim()) {
                setCurrentStep(2);
                return;
            } else if (currentStep === 2 && formData.materials.length > 0) {
                setCurrentStep(3);
                return;
            } else if (currentStep === 3) {
                setCurrentStep(4);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            itemName: '',
            materials: [],
            materialsOther: '',
            size: '',
            condition: '',
            plasticType: '',
            quantity: '',
            specialFeatures: '',
            userLocation: ''
        });
        setRecyclingGuidance(null);
        setError('');
        setCurrentStep(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-14 px-6 text-gray-800">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold text-green-700 mb-4 text-center">
                    📋 Item Recycling Guide
                </h1>
                <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
                    Get personalized recycling guidance for any item!
                </p>
                
                {currentStep > 1 && (
                    <div className="text-center mb-6">
                        <button 
                            onClick={resetForm}
                            className="inline-flex items-center bg-green-50 hover:bg-green-100 text-green-700 font-medium px-4 py-2 rounded-full border border-green-200 transition"
                        >
                            ← Start Over
                        </button>
                    </div>
                )}

                {!recyclingGuidance ? (
                    <div className="bg-white rounded-2xl shadow p-8">
                        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Step {currentStep} of 4</span>
                                    <span>{Math.round(((currentStep - 1) / 4) * 100)}% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                        style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            {/* Step 1: Basic Item Information */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-6">Step 1: Basic Information</h2>
                                    
                                    <div className="mb-6">
                                        <label htmlFor="item-name" className="block text-lg font-semibold text-gray-700 mb-2">
                                            Item name/description *
                                        </label>
                                        <input
                                            id="item-name"
                                            type="text"
                                            value={formData.itemName}
                                            onChange={(e) => handleInputChange('itemName', e.target.value)}
                                            placeholder="e.g., water bottle, smartphone, pizza box, etc."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {formData.itemName && (
                                        <div className="text-center">
                                            <button 
                                                type="button"
                                                onClick={() => setCurrentStep(2)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors"
                                            >
                                                Next: Materials →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Materials & Markings */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-6">Step 2: Materials & Markings *</h2>
                                    <p className="text-gray-600 mb-6">Select all that apply:</p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                        {materialOptions.map(material => (
                                            <label key={material} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.materials.includes(material)}
                                                    onChange={() => handleMaterialChange(material)}
                                                    disabled={isLoading}
                                                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{material}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {formData.materials.includes('Plastic') && (
                                        <div className="mb-6">
                                            <label htmlFor="plastic-type" className="block text-lg font-semibold text-gray-700 mb-2">
                                                Plastic recycling code (if visible on item)
                                            </label>
                                            <select
                                                id="plastic-type"
                                                value={formData.plasticType}
                                                onChange={(e) => handleInputChange('plasticType', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                disabled={isLoading}
                                            >
                                                <option value="">Not sure/No code visible</option>
                                                <option value="Mobius Loop">♲ Mobius Loop (generic recycling symbol)</option>
                                                <option value="#1 PET">♳ #1 PET (water bottles)</option>
                                                <option value="#2 HDPE">♴ #2 HDPE (milk jugs)</option>
                                                <option value="#3 PVC">♵ #3 PVC (pipes)</option>
                                                <option value="#4 LDPE">♶ #4 LDPE (bags)</option>
                                                <option value="#5 PP">♷ #5 PP (yogurt containers)</option>
                                                <option value="#6 PS">♸ #6 PS (styrofoam)</option>
                                                <option value="#7 Other">♹ #7 Other (mixed plastics)</option>
                                            </select>
                                        </div>
                                    )}

                                    {(formData.materials.includes('Metal (Other)') || formData.materials.includes('Other')) && (
                                        <div className="mb-6">
                                            <label htmlFor="materials-other" className="block text-lg font-semibold text-gray-700 mb-2">
                                                Specify other materials (if applicable)
                                            </label>
                                            <input
                                                id="materials-other"
                                                type="text"
                                                value={formData.materialsOther}
                                                onChange={(e) => handleInputChange('materialsOther', e.target.value)}
                                                placeholder="e.g., steel, mixed metal, etc."
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <button 
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                                        >
                                            ← Back
                                        </button>
                                        {formData.materials.length > 0 && (
                                            <button 
                                                type="button"
                                                onClick={() => setCurrentStep(3)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors"
                                            >
                                                Next: Details →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Physical Details */}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-6">Step 3: Physical Details</h2>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="size" className="block text-lg font-semibold text-gray-700 mb-2">Size category</label>
                                            <select
                                                id="size"
                                                value={formData.size}
                                                onChange={(e) => handleInputChange('size', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                disabled={isLoading}
                                            >
                                                <option value="">Select size...</option>
                                                {sizeOptions.map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="condition" className="block text-lg font-semibold text-gray-700 mb-2">Current condition</label>
                                            <select
                                                id="condition"
                                                value={formData.condition}
                                                onChange={(e) => handleInputChange('condition', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                disabled={isLoading}
                                            >
                                                <option value="">Select condition...</option>
                                                {conditionOptions.map(condition => (
                                                    <option key={condition} value={condition}>{condition}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="quantity" className="block text-lg font-semibold text-gray-700 mb-2">How many items?</label>
                                            <input
                                                id="quantity"
                                                type="text"
                                                value={formData.quantity}
                                                onChange={(e) => handleInputChange('quantity', e.target.value)}
                                                placeholder="e.g., 1, 5, a bag full, etc."
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-8">
                                        <button 
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                                        >
                                            ← Back
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setCurrentStep(4)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors"
                                        >
                                            Next: Final Details →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Additional Information */}
                            {currentStep >= 4 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-6">Step 4: Additional Information</h2>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="special-features" className="block text-lg font-semibold text-gray-700 mb-2">
                                                Any special features or concerns?
                                            </label>
                                            <textarea
                                                id="special-features"
                                                value={formData.specialFeatures}
                                                onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                                                placeholder="e.g., contains batteries, has food residue, multiple parts, hazardous materials, etc."
                                                rows="3"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="user-location" className="block text-lg font-semibold text-gray-700 mb-2">
                                                Your location (for local guidance)
                                            </label>
                                            <input
                                                id="user-location"
                                                type="text"
                                                value={formData.userLocation}
                                                onChange={(e) => handleInputChange('userLocation', e.target.value)}
                                                placeholder="e.g., New York, NY or ZIP code"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-red-700">{error}</p>
                                        </div>
                                    )}

                                    <div className="flex justify-between mt-8">
                                        <button 
                                            type="button"
                                            onClick={() => setCurrentStep(3)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                                        >
                                            ← Back
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? '🔍 Analyzing...' : '♻️ Get Recycling Guide'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Analysis Section */}
                        <div className="bg-white rounded-2xl shadow p-6">
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">🔍</span>
                                <h2 className="text-2xl font-bold text-green-700">Item Analysis</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><strong>Item:</strong> {recyclingGuidance.analysis.item}</div>
                                <div><strong>Material:</strong> {recyclingGuidance.analysis.material}</div>
                                <div>
                                    <strong>Recyclability:</strong> 
                                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                        recyclingGuidance.analysis.recyclability.toLowerCase().includes('yes') 
                                            ? 'bg-green-100 text-green-800'
                                            : recyclingGuidance.analysis.recyclability.toLowerCase().includes('no')
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {recyclingGuidance.analysis.recyclability}
                                    </span>
                                </div>
                                {recyclingGuidance.analysis.recyclingCode && (
                                    <div><strong>Recycling Code:</strong> {recyclingGuidance.analysis.recyclingCode}</div>
                                )}
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="bg-white rounded-2xl shadow p-6">
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">♻️</span>
                                <h2 className="text-2xl font-bold text-green-700">Recycling Instructions</h2>
                            </div>
                            <div className="space-y-4">
                                <div><strong>Method:</strong> {recyclingGuidance.instructions.method}</div>
                                <div>
                                    <strong>Preparation Steps:</strong>
                                    {Array.isArray(recyclingGuidance.instructions.preparation) ? (
                                        <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                                            {recyclingGuidance.instructions.preparation.map((step, index) => (
                                                <li key={index} className="text-gray-700">{step}</li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <span className="ml-2">{recyclingGuidance.instructions.preparation}</span>
                                    )}
                                </div>
                                <div><strong>Where to take it:</strong> {recyclingGuidance.instructions.location}</div>
                                {recyclingGuidance.instructions.timing &&  recyclingGuidance.instructions.timing.length > 0 && (
                                    <div><strong>Timing:</strong> {recyclingGuidance.instructions.timing}</div>
                                )}
                            </div>
                        </div>

                        {/* Warnings Section */}
                        {recyclingGuidance.warnings && recyclingGuidance.warnings.length > 0 && (
                            <div className="bg-yellow-50 rounded-2xl shadow p-6 border border-yellow-200">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">⚠️</span>
                                    <h2 className="text-2xl font-bold text-yellow-700">Important Warnings</h2>
                                </div>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {recyclingGuidance.warnings.map((warning, index) => (
                                        <li key={index}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Environmental Impact */}
                        <div className="bg-green-50 rounded-2xl shadow p-6 border border-green-200">
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-2">🌱</span>
                                <h2 className="text-2xl font-bold text-green-700">Environmental Impact</h2>
                            </div>
                            <p className="text-gray-700">{recyclingGuidance.environmentalImpact}</p>
                        </div>

                        {/* Alternatives Section */}
                        {recyclingGuidance.alternatives && (
                            <div className="bg-white rounded-2xl shadow p-6">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">🔄</span>
                                    <h2 className="text-2xl font-bold text-green-700">Alternative Options</h2>
                                </div>
                                <div className="space-y-6">
                                    {recyclingGuidance.alternatives.reuse && recyclingGuidance.alternatives.reuse.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-lg text-green-700 mb-2">Reuse Ideas:</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                {recyclingGuidance.alternatives.reuse.map((idea, index) => (
                                                    <li key={index}>{idea}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {recyclingGuidance.alternatives.donation && recyclingGuidance.alternatives.donation.length > 0 &&(
                                        <div>
                                            <h3 className="font-bold text-lg text-green-700 mb-2">Donation:</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>{recyclingGuidance.alternatives.donation}</li>
                                            </ul>
                                        </div>
                                    )}

                                    {recyclingGuidance.alternatives.upcycling && recyclingGuidance.alternatives.upcycling.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-lg text-green-700 mb-2">Upcycling Projects:</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                {recyclingGuidance.alternatives.upcycling.map((project, index) => (
                                                    <li key={index}>{project}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tips Section */}
                        {recyclingGuidance.tips && recyclingGuidance.tips.length > 0 && (
                            <div className="bg-blue-50 rounded-2xl shadow p-6 border border-blue-200">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">💡</span>
                                    <h2 className="text-2xl font-bold text-blue-700">Additional Tips</h2>
                                </div>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {recyclingGuidance.tips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Related Items Section */}
                        {recyclingGuidance.relatedItems && recyclingGuidance.relatedItems.length > 0 && (
                            <div className="bg-purple-50 rounded-2xl shadow p-6 border border-purple-200">
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl mr-2">🔗</span>
                                    <h2 className="text-2xl font-bold text-purple-700">Related Items</h2>
                                </div>
                                <p className="text-gray-700 mb-3">Similar items that follow the same disposal process:</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {recyclingGuidance.relatedItems.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Guide;