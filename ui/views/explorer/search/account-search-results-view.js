import React from 'react'
import {StrKey} from 'stellar-sdk'
import {AccountAddress, UtcTimestamp, parseMuxedAccount, useExplorerApi} from '@stellar-expert/ui-framework'
import {formatPrice} from '@stellar-expert/formatter'
import {resolvePath} from '../../../business-logic/path'
import SearchResultsSectionView from './search-results-section-view'

function formatLink(account, tab) {
    return resolvePath(`account/${account}${tab ? `?filter=${tab}` : ''}`)
}

export default function AccountSearchResultsView({term, onLoaded}) {
    let accountAddress = term
    if (StrKey.isValidMed25519PublicKey(term)) {
        accountAddress = parseMuxedAccount(term).address
    }
    const response = useExplorerApi('account?search=' + encodeURIComponent(accountAddress))
    if (!response.loaded) return null
    const {records} = response?.data?._embedded || {}
    //onLoaded(response.data)
    if (!records?.length) {
        onLoaded(null)
        return null
    }
    const results = records.map(({account, created, trades=0, payments=0, deleted}) => {
        const address = account === accountAddress ? term : account //replace result for a muxed account
        return {
            link: resolvePath(`account/${address}`),
            title: <>Account <AccountAddress account={address} link={false} chars={12}/>{deleted &&
                <span className="details">(deleted)</span>}</>,
            description: <>
                {created > 0 ? <>Created&nbsp;<UtcTimestamp date={created} dateOnly/></> : <>Signing key</>}{' | '}
                {formatPrice(payments)}&nbsp;payments{', '}
                {formatPrice(trades)}&nbsp;trades
            </>,
            links: <>
                <a href={formatLink(account)}>Transactions history</a>&emsp;
                <a href={formatLink(account, 'trades')}>Trades history</a>&emsp;
                <a href={formatLink(account, 'active-offers')}>Active DEX offers</a>
            </>
        }
    })

    onLoaded(results)

    return <SearchResultsSectionView key="accounts" section="Accounts" items={results}/>
}