export default jest.fn(() => ({
    get: (_, defaultValue) => defaultValue,
}));
