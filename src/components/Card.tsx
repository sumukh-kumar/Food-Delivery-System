interface CardProps {
    image: string;
    name: string;
    role?: string;
  }
  
  const Card = ({ image, name, role }: CardProps) => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover transition-transform duration-300 ease-out transform group-hover:scale-110"
          />
        </div>
        <div className="p-6 text-center transition-transform duration-300 ease-out transform group-hover:translate-y-[-8px]">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
          {role && <p className="text-sm text-gray-600">{role}</p>}
        </div>
      </div>
    );
  };
  
  export default Card;