export const formatBalance = (balance:number) => {
    return new Intl.NumberFormat('de-DE').format(balance);
};

