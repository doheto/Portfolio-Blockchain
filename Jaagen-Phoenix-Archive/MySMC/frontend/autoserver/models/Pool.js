// server/models/Pool.js
const mongoose = require('mongoose');
let PoolSchema = new mongoose.Schema(
    {
        uniqid: String,
        adminsaddress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AnAddress'
            }
        ],
        address: String,
        destinationaddress: String,
        refundaddress: String,
        refundedAmount: {
                    type: Number,
                    default: 0
                },
        numberOfRefundsDone: {
            type: Number,
            default: 0
        },
        tokenReceivedContractAddress: String,
        tokenReceivedAmount: {
            type: Number,
            default: 0
        },
        tokenWithdrawnAmount: {
            type: Number,
            default: 0
        },
        WithdrawnAmountRefund: {
            type: Number,
            default: 0
        },
        MajorEvents: [
            {
                typeofMajorEvent: String,
                Time: Date,
                status: String,
                possibleValue: String,
                requestedAction: String,
                refundAutoFailed: [
                    {
                        user: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'AnAddress'
                        },
                        amount: {
                            type: Number,
                            default: 0
                        },
                    }
                ],
                tokenAutoFailed: [
                    {
                        user: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'AnAddress'
                        },
                        amount: {
                            type: Number,
                            default: 0
                        },
                    }
                ]
            }
        ],
        tokenSymbol: String,
        tokenName: String,
        state: String,  ////0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund
        total: String,
        amountReceivedByAdmin: {
                    type: Number,
                    default: 0
                },
        amountSentToDestination: {
                    type: Number,
                    default: 0
                },
        mincontribution: String,
        maxcontribution: String,
        currentlyraised: {
                    type: Number,
                    default: 0
                },
        userPossibleAction1: String,
        userPossibleAction2: String,
        adminPossibleAction1: String,
        adminPossibleAction2: String,
        managerFee: String,
        firstcontribution: {
            type: Boolean,
            default: false,
        },
        serviceFeePercentage: String,
        numberOfAutodistrib: {
            type: Number,
            default: 0
        },
        numberOfAutodistribUsed: {
            type: Number,
            default: 0
        },
        autodistributionInProgress: {
            type: Boolean,
            default: false
        },
        refundautodistributionInProgress: {
            type: Boolean,
            default: false
        },
        feePerAutodistrib: String,
        kycrequired: Boolean,
        autodistribution: Boolean,
        whitelistrequired: Boolean,
        TimeOfTadbSent: [
            {
                Time: Date,
                success: Boolean,
                Tx: String,
                MoreDetails: String,
            }
        ],
        TimeOfadbSent: [
            {
                Time: Date,
                success: Boolean,
                Tx: String,
                MoreDetails: String,
            }
        ],
        // userAutoDistributionFailed: [
        //     {
        //         address: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: 'AnAddress'
        //         },
        //         theAmount: {
        //             type: Number,
        //             default: 0
        //         },
        //         type: String,
        //     }
        // ],
        mstk: String,
        whitelist: [],
        contributors: [
            {
                address: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'AnAddress'
                },
                balance: {
                    type: Number,
                    default: 0
                },
                RefundWithdrawn: {
                    type: Number,
                    default: 0
                },
                tokenWithdrawn: {
                    type: Number,
                    default: 0
                },
                history: [
                    {
                        action: String,
                        amount: {
                            type: Number,
                            default: 0
                        },
                    }
                ]
            }
        ]
    }
);

module.exports = mongoose.model('Pool', PoolSchema);

////0-notcreated, 1-open, 2-cancel, 3-paid, 4-tokensreceived, 5-refund

// from open u can go to either cancel or Paid
    // from cancel no other state possible. Admins : after order sent all buttons grayed,  Users : can only withdraw if they have funds
    // from paid u can go to either admins : token receive or Refund  users: both buttons deactivated
        // from token receive just receive token or autodistribute
        // from refund (you take all fee and gas change 