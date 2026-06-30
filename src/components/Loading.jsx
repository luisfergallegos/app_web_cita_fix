
export function Loading() {
    return (

        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>

                    <p className="mt-4 text-sm text-white">
                        Cargando...
                    </p>
                </div>
            </div>
        </>

    );
}

export default Loading;