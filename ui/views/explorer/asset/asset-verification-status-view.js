import React from 'react'
import {ExternalLink, useDirectory, useAssetMeta, useTomlData} from '@stellar-expert/ui-framework'
import Info from '../../components/info-tooltip'
import TomlValidatorView from '../toml/toml-validator-view'

function AssetIcon({asset}) {
    if (!asset) return null
    const {image, orgLogo} = (asset.toml_info || {})
    const imgSrc = image || orgLogo
    if (!imgSrc) return null
    return <img src={imgSrc} style={{maxWidth: '24px', maxHeight: '24px', verticalAlign: 'text-bottom'}}/>
}

export default function AssetVerificationStatusView({asset}) {
    const {issuerInfo} = asset,
        {loaded, data: tomlData} = useTomlData(issuerInfo?.home_domain),
        meta = useAssetMeta(asset.descriptor),
        directoryInfo = useDirectory(asset?.descriptor?.issuer)
    if (issuerInfo === undefined) return null

    if (directoryInfo && (directoryInfo.tags || []).includes('malicious')) return <>
        <i className="icon icon-warning color-warning"/>
        Warning: reported for illicit or fraudulent activity
    </>
    if (!issuerInfo) return <>(related asset metadata not found)
        <Info link="https://www.stellar.org/developers/guides/concepts/stellar-toml.html">Asset issuing account's home
            domain was not set or matching <code>stellar.toml</code> file was not found on the domain specified in the
            issuer account settings.</Info>
    </>
    return <>
        <AssetIcon asset={meta}/>
        {!!tomlData && <> <ExternalLink href={`https://${issuerInfo.home_domain}`}>{issuerInfo.home_domain}</ExternalLink></>}
        <TomlValidatorView address={asset?.descriptor?.issuer} assetCode={asset?.descriptor?.code} domain={issuerInfo?.home_domain}/>
    </>
}