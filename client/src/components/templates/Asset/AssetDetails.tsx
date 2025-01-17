import React from 'react'
import Moment from 'react-moment'
import { DDO, MetaData, File } from '@oceanprotocol/squid'
import shortid from 'shortid'
import Markdown from '../../atoms/Markdown'
import CategoryLink from '../../atoms/CategoryLink'
import styles from './AssetDetails.module.scss'
import AssetFilesDetails from './AssetFilesDetails'
import Report from './Report'
import Web3 from 'web3'

interface AssetDetailsProps {
    metadata: MetaData
    ddo: DDO
}

export function datafilesLine(files: File[]) {
    if (files.length === 1) {
        return <span>{files.length} data file</span>
    }
    return <span>{files.length} data files</span>
}

const MetaFixedItem = ({ name, value }: { name: string; value: string }) => (
    <li>
        <span className={styles.metaLabel}>
            <strong>{name}</strong>
        </span>
        <span className={styles.metaValue}>{value}</span>
    </li>
)

export default function AssetDetails({ metadata, ddo }: AssetDetailsProps) {
    const { base } = metadata
    const price = base.price && Web3.utils.fromWei(base.price.toString())

    const metaFixed = [
        {
            name: 'Author',
            value: base.author,
            show: true
        },
        {
            name: 'License',
            value: base.license,
            show: true
        },
        {
            name: 'DID',
            value: ddo.id,
            show: true
        },
        {
            name: 'Price',
            value: `${price} OCEAN`,
            show: price !== '0'
        }
    ]

    return (
        <>
            <aside className={styles.metaPrimary}>
                <h2 className={styles.copyrightHolder} title="Copyright Holder">
                    {base.copyrightHolder}
                </h2>
                <div className={styles.metaPrimaryData}>
                    <span
                        title={`Date created, published on ${base.datePublished}`}
                    >
                        <Moment
                            date={base.dateCreated}
                            format="L"
                            interval={0}
                        />
                    </span>

                    {base.categories && (
                        <CategoryLink category={base.categories[0]} />
                    )}

                    {base.files && datafilesLine(base.files)}
                </div>
            </aside>

            {base.description && (
                <Markdown
                    text={base.description}
                    className={styles.description}
                />
            )}

            <Report did={ddo.id} title={metadata.base.name} />

            <div className={styles.metaFixed}>
                <h2
                    className={styles.metaFixedTitle}
                    title="This metadata can not be changed because it is used to generate the checksums for the DDO, and to encrypt the file urls."
                >
                    Fixed Metadata
                </h2>
                <ul>
                    {metaFixed
                        .filter(item => item.show)
                        .map(item => (
                            <MetaFixedItem
                                key={shortid.generate()}
                                name={item.name}
                                value={item.value}
                            />
                        ))}
                </ul>
            </div>

            <AssetFilesDetails files={base.files ? base.files : []} ddo={ddo} />
        </>
    )
}
