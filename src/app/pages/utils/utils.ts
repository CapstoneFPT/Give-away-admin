export const formatBalance = (balance:number) => {
    return new Intl.NumberFormat('de-DE').format(balance);
};
export const dateTimeOptions : Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
}

export const VNLocale = 'vi-VN';



export const paymentMethod  = (method: string ) => {
    switch (method) {
        case 'Point':
            return 'warning';
        case 'QRCode':
            return 'info';
        case 'COD':
            return 'primary';
        default:
            return 'secondary';
    }
};
export const purchaseType  = (type: string ) => {
    switch (type) {
        case 'Online':
            return 'primary';
        default:
            return 'warning';
    }
};



