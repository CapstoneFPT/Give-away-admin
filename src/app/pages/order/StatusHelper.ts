const getStatusColor = (status?: string) => {
    switch (status) {
        case 'Active':
            return 'success';
        case 'Pending':
            return 'warning';
        case 'Completed':
            return 'info';
        default:
            return 'primary';
    }
};

export { getStatusColor }