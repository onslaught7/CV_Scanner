export const createAuthSlice = (set) => ({
    userInfo: undefined,
    toastMessage: undefined,
    setUserInfo: (userInfo) => set({ userInfo }),
    setToastMessage: (toastMessage) => set({ toastMessage }),
    clearToastMessage: () => set({ toastMessage: undefined }),
});