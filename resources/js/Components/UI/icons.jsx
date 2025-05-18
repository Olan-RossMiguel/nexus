// resources/js/Components/UI/icons.jsx
export const Heart = (props) => (
    <svg
        {...props}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path d="M12 21C12 21 7 16 4 12.5C1.5 9.5 1.5 5.5 5 3.5C7 2.5 9 3.5 10 5C11 3.5 13 2.5 15 3.5C18.5 5.5 18.5 9.5 16 12.5C13 16 12 21 12 21Z" />
    </svg>
);

export const HeartFilled = (props) => (
    <svg {...props} fill="red" stroke="red" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 21C12 21 7 16 4 12.5C1.5 9.5 1.5 5.5 5 3.5C7 2.5 9 3.5 10 5C11 3.5 13 2.5 15 3.5C18.5 5.5 18.5 9.5 16 12.5C13 16 12 21 12 21Z" />
    </svg>
);
