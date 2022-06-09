// $ PRIVATE_KEY_PASSWORD=<password> node deploy.js
// $ history -c

const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = await wallet.connect(provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    // console.log(contract);
    await contract.deployTransaction.wait(1) // wait one block confirmation
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`currentFavoriteNumber: ${currentFavoriteNumber.toString()}`)
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`updatedFavoriteNumber: ${updatedFavoriteNumber.toString()}`)
    // console.log("Deployment transaction:", contract.deployTransaction);
    // console.log("Transaction receipt:", transactionReceipt);

    // console.log("Deploy with only transaction data!");
    // const tx = {
    //   nonce: await wallet.getTransactionCount(),
    //   gasPrice: 20000000000,
    //   gasLimit: 1000000,
    //   to: null,
    //   value: 0,
    //   data: "0x608060405234801561001057600080fd5b50610843806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80632e64cec1146100675780634f2be91f146100855780636057361d146100a35780636f760f41146100bf5780638bab8dd5146100db5780639e7a13ad1461010b575b600080fd5b61006f61013c565b60405161007c91906103d5565b60405180910390f35b61008d610145565b60405161009a91906103d5565b60405180910390f35b6100bd60048036038101906100b89190610430565b61014e565b005b6100d960048036038101906100d491906104c2565b610158565b005b6100f560048036038101906100f09190610663565b61022f565b60405161010291906103d5565b60405180910390f35b61012560048036038101906101209190610430565b61025d565b604051610133929190610734565b60405180910390f35b60008054905090565b60006002905090565b8060008190555050565b6002604051806040016040528083815260200185858080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508152509080600181540180825580915050600190039060005260206000209060020201600090919091909150600082015181600001556020820151816001019080519060200190610202929190610319565b5050508060018484604051610218929190610794565b908152602001604051809103902081905550505050565b6001818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6002818154811061026d57600080fd5b9060005260206000209060020201600091509050806000015490806001018054610296906107dc565b80601f01602080910402602001604051908101604052809291908181526020018280546102c2906107dc565b801561030f5780601f106102e45761010080835404028352916020019161030f565b820191906000526020600020905b8154815290600101906020018083116102f257829003601f168201915b5050505050905082565b828054610325906107dc565b90600052602060002090601f016020900481019282610347576000855561038e565b82601f1061036057805160ff191683800117855561038e565b8280016001018555821561038e579182015b8281111561038d578251825591602001919060010190610372565b5b50905061039b919061039f565b5090565b5b808211156103b85760008160009055506001016103a0565b5090565b6000819050919050565b6103cf816103bc565b82525050565b60006020820190506103ea60008301846103c6565b92915050565b6000604051905090565b600080fd5b600080fd5b61040d816103bc565b811461041857600080fd5b50565b60008135905061042a81610404565b92915050565b600060208284031215610446576104456103fa565b5b60006104548482850161041b565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083601f8401126104825761048161045d565b5b8235905067ffffffffffffffff81111561049f5761049e610462565b5b6020830191508360018202830111156104bb576104ba610467565b5b9250929050565b6000806000604084860312156104db576104da6103fa565b5b600084013567ffffffffffffffff8111156104f9576104f86103ff565b5b6105058682870161046c565b935093505060206105188682870161041b565b9150509250925092565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61057082610527565b810181811067ffffffffffffffff8211171561058f5761058e610538565b5b80604052505050565b60006105a26103f0565b90506105ae8282610567565b919050565b600067ffffffffffffffff8211156105ce576105cd610538565b5b6105d782610527565b9050602081019050919050565b82818337600083830152505050565b6000610606610601846105b3565b610598565b90508281526020810184848401111561062257610621610522565b5b61062d8482856105e4565b509392505050565b600082601f83011261064a5761064961045d565b5b813561065a8482602086016105f3565b91505092915050565b600060208284031215610679576106786103fa565b5b600082013567ffffffffffffffff811115610697576106966103ff565b5b6106a384828501610635565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156106e65780820151818401526020810190506106cb565b838111156106f5576000848401525b50505050565b6000610706826106ac565b61071081856106b7565b93506107208185602086016106c8565b61072981610527565b840191505092915050565b600060408201905061074960008301856103c6565b818103602083015261075b81846106fb565b90509392505050565b600081905092915050565b600061077b8385610764565b93506107888385846105e4565b82840190509392505050565b60006107a182848661076f565b91508190509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806107f457607f821691505b602082108103610807576108066107ad565b5b5091905056fea2646970667358221220da796ac9a2684b0732337f722d782e86022ba5bf25371d79b5046b471c30366d64736f6c634300080e0033",
    //   chainId: 1337,
    // };
    // // const signedTxResponse = await wallet.signTransaction(tx);
    // // console.log(signedTxResponse);
    // const sentTxResponse = await wallet.sendTransaction(tx);
    // await sentTxResponse.wait(1);
    // console.log(sentTxResponse);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
