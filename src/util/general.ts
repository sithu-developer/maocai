// check at the order delete warning
export const isExpired7Days = (createdDate : Date) => {
    const currentDate = new Date();
    
    const differentMilisec = Math.abs(currentDate.getTime() - createdDate.getTime())

    const diffDays = differentMilisec / (1000 * 60 * 60 * 24);

    return diffDays >= 7;
};