// import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

// export function OwnedObjects() {
//     const account = useCurrentAccount();
//     // const { data, isPending, error } = useSuiClientQuery(
//     //     "getObject",
//     //     {
//     //         id: "0xeab0d9d57e25cfd6e9f6f77a5d01fbb5d6c527fac0e3310af9ab045c1d7e27d1",
//     //     },
//     //     {
//     //         enabled: !!account,
//     //     },
//     // );

//     const { data, isPending, error } = useSuiClientQuery(
//         "getObject",
//         {
//             id: "0xeab0d9d57e25cfd6e9f6f77a5d01fbb5d6c527fac0e3310af9ab045c1d7e27d1",
//             options:
//             {
//                 "showType": true,
//                 "showOwner": true,
//                 "showPreviousTransaction": true,
//                 "showDisplay": true,
//                 "showContent": true,
//                 "showBcs": true,
//                 "showStorageRebate": true
//             }
//         },
//         {
//             enabled: !!account,
//         },
//     );

//     console.log(data);

//     if (!account) {
//         return;
//     }

//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }

//     if (isPending || !data) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="direction-column my-2">
//             <div className="flex">
//                 <p>Object ID: {data.data.objectId}</p>
//             </div>
//         </div>
//     );
// }
