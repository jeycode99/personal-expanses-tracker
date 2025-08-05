export const getIconBackground = (icon: string) => {
  switch (icon) {
    case 'cart-outline':
      return 'bg-blue-200';
    case 'car-outline':
      return 'bg-green-200';
    case 'fast-food-outline':
      return 'bg-red-200';
    case 'game-controller-outline':
      return 'bg-indigo-200';
    case 'medical-outline':
      return 'bg-pink-200';
    case 'book-outline':
      return 'bg-purple-200';
    case 'receipt-outline':
      return 'bg-yellow-200';
    case 'ellipsis-horizontal-outline':
      return 'bg-gray-200';
    case 'arrow-down-outline':
      return 'bg-blue-200';
    case 'arrow-up-outline':
      return 'bg-red-200';
    case 'cash-outline':
      return 'bg-green-200';
    default:
      return 'bg-green-200';
  }
}; 