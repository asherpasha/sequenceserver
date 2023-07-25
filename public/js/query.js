import React from 'react';
import _ from 'underscore';

import HitsOverview from './hits_overview';
import LengthDistribution from './length_distribution'; // length distribution of hits
import Utils from './utils'; // to use as mixin in HitsTable

/**
 * Query component displays query defline, graphical overview, length
 * distribution, and hits table.
 */
export default React.createClass({

    // Kind of public API //

    /**
     * Returns the id of query.
     */
    domID: function () {
        return 'Query_' + this.props.query.number;
    },

    queryLength: function () {
        return this.props.query.length;
    },

    /**
     * Returns number of hits.
     */
    numhits: function () {
        return this.props.query.hits.length;
    },

    // Life cycle methods //

    render: function () {
        return (
            <div className="resultn" id={this.domID()}
                data-query-len={this.props.query.length}
                data-algorithm={this.props.program}>
                { this.headerJSX() }
                { this.numhits() && this.hitsListJSX() || this.noHitsJSX() }
            </div>
        );
    },

    headerJSX: function () {
        var meta = `length: ${this.queryLength().toLocaleString()}`;
        if (this.props.showQueryCrumbs) {
            meta = `query ${this.props.query.number}, ` + meta;
        }
        return <div className="section-header">
            <h3>
                <strong>Query=&nbsp;{this.props.query.id}</strong>&nbsp;
                {this.props.query.title}
            </h3>
            <span className="label label-reset pos-label">{ meta }</span>
        </div>;
    },

    hitsListJSX: function () {
        return <div className="section-content">
            <HitsOverview key={'GO_' + this.props.query.number} query={this.props.query} program={this.props.program} collapsed={this.props.veryBig} />
            <LengthDistribution key={'LD_' + this.props.query.id} query={this.props.query} algorithm={this.props.program} collapsed="true" />
            <HitsTable key={'HT_' + this.props.query.number} query={this.props.query} imported_xml={this.props.imported_xml} />
        </div>;
    },

    noHitsJSX: function () {
        return <div className="section-content">
            <strong> ****** No hits found ****** </strong>
        </div>;
    },

    // Each update cycle will cause all previous queries to be re-rendered.
    // We avoid that by implementing shouldComponentUpdate life-cycle hook.
    // The trick is to simply check if the components has recieved props
    // before.
    shouldComponentUpdate: function () {
        // If the component has received props before, query property will
        // be set on it. If it is, we return false so that the component
        // is not re-rendered. If the query property is not set, we return
        // true: this must be the first time react is trying to render the
        // component.
        return !this.props.query;
    }
});

/**
 * Renders summary of all hits per query in a tabular form.
 */
var HitsTable = React.createClass({
    getInitialState: function () {
        return {
            tools:{}
        };
    },
    mixins: [Utils],

    loadBarToolsInfo:function() {
        $.getJSON(`../barTools.json`, function(data) {
            this.setState({
                tools:data
            });
        }.bind(this));

    },

    getBARLink: function(hit){
        var locus=hit.id;
        var newid;
        var barURL=[];
        var species=null;

        const postfix= {
            'eplant':'&Genes=',
            'efp':'&modeInput=Absolute&primaryGene='
        };
        const barTools=this.state.tools;
        if (Object.keys(barTools).length===0){
            return []
        }
        if (locus.includes('Bradi')){
            newid=locus.match(/[^.]+/);
            species='Brachypodium_distachyon'
        } else if (locus.includes('GRMZM')){
            newid=locus.match(/[^_]+/);
            species='Zea_mays'
            barURL=[`${barTools[species].eplant}${postfix.eplant}${newid}`];
        } else if (locus.includes('zm')){
            newid=locus.match(/[^_]+/);
            species='Zea_mays';
            barURL=[`${barTools[species].efp}${postfix.efp}${newid}`];
        } else if (locus.includes('Potri')){
            newid=locus.match(/[^.]*.[^.]*/);
            species='Populus_trichocarpa';
        } else if (locus.includes('Solyc')){
            newid=locus.match(/[^.]+/); 
            species='Solanum_lycopersicum' ;
        } else if (locus.includes('Csa')){
            newid=locus.match(/[^.]+/);
            species='Camelina_sativa' ;
        } else if (locus.includes('Glyma')){
            newid=locus.match(/[^.]*.[^.]*/);
            species='Glycine_max';
        } else if (locus.includes('PGSC')){
            newid=locus;
            species='Solanum_tuberosum'
        } else if (locus.includes('HORVU')){
            newid=locus.match(/[^.]+/);
            species='Hordeum_vulgare';
            barURL=[`${barTools[species].eplant}${postfix.eplant}${newid}`];
        } else if (locus.includes('Contig')){
            newid=locus.match(/[^.]+/);
            barURL=[`${barTools[species].efp}${postfix.efp}${newid}}`];
            species='Hordeum_vulgare'
        } else if (locus.includes('Medtr')){
            newid=locus.match(/[^.]+/);
            species='Medicago_truncatula';
        } else if (locus.includes('Eucgr')){
            newid=locus.match(/[^.]*.[^.]*/);
            species='Eucalyptus_grandis';            
        } else if (locus.includes('LOC_Os')){
            newid=locus.match(/[^.]+/);
            species='Oryza_sativa';
        } else if (locus.includes('Sapur')){
            newid=locus.match(/[^.]*.[^.]*/);
            species='Salix_purpurea';
        } else if (locus.includes('HanXRQ')){
            newid=locus;
            species='Helianthus_annuus';
        } else if (locus.includes('AGQN')){
            newid=locus;
            species='Cannabis_sativa';
        } else if (locus.includes('Traes')){
            newid=locus.match(/[^.]+/);
            species='Triticum_aestivum';
        } else if (locus.includes('Sh')){
            newid=locus;
            species='Saccharum'
        } else if (locus.includes('VIT')){
            newid=locus.match(/[^.]+/);
            species='Vitis'
        } else if (locus.includes('DN')){
            newid=locus.match(/[^.]+/);
            species='Mangosteen'
        } else if (locus.includes('Ep_')){
            newid=locus.match(/[^.]+/);
            species='Euphorbia'
        } else if (locus.includes('Thhalv')){
            if (locus.slice(-2)!='.g'){
                newid=locus+'.g';
            } else {
                newid=locus;
            }
            species='Eutrema'
        } else if (locus.includes('AT')) {
            newid=locus.split('.')[0];
            species='Arabidopsis_thaliana';
        }

        if (barURL.length===0 && species && species in barTools){
            for (const [key,url] of Object.entries(barTools[species])) {
                barURL.push(`${url}${postfix[key]}${newid}`) 
            }
        }
         
        return barURL;
    },
    componentDidMount:function(){
        this.loadBarToolsInfo();
    },
    render: function () {
        var hasName = _.every(this.props.query.hits, function(hit) {
            return hit.sciname !== '';
        });

        // Width of sequence column is 55% when species name is not shown and
        // query coverage is.
        var seqwidth = 45;
        // If we are going to show species name, then reduce the width of
        // sequence column by the width of species column.
        if (hasName) seqwidth -= 15;
        // If we are not going to show query coverage (i.e. for imported XML),
        // then increase the width of sequence column by the width of coverage
        // column.
        if (this.props.imported_xml) seqwidth += 15;

        return (
            <div className="table-hit-overview">
                <h4 className="caption" data-toggle="collapse" data-target={'#Query_'+this.props.query.number+'HT_'+this.props.query.number}>
                    <i className="fa fa-minus-square-o"></i>&nbsp;
                    <span>Sequences producing significant alignments</span>
                </h4>
                <div className="collapsed in"id={'Query_'+ this.props.query.number + 'HT_'+ this.props.query.number}>
                    <table
                        className="table table-hover table-condensed tabular-view ">
                        <thead>
                            <th className="text-left">#</th>
                            <th width={`${seqwidth}%`}>Similar sequences</th>
                            {hasName && <th width="15%" className="text-left">Species</th>}
                            {!this.props.imported_xml && <th width="15%" className="text-right">Query coverage (%)</th>}
                            <th width="10%" className="text-right">Total score</th>
                            <th width="10%" className="text-right">E value</th>
                            <th width="10%" className="text-right" data-toggle="tooltip"
                                data-placement="left" title="Total identity of all hsps / total length of all hsps">
                        Identity (%)
                            </th>
                            <th colSpan={2} width="10%" className="text-right">BAR Tools</th>
                        </thead>
                        <tbody>
                            {
                                _.map(this.props.query.hits, _.bind(function (hit) {
                                    const barLinks=this.getBARLink(hit);
                                    return (
                                        <tr key={hit.number}>
                                            <td className="text-left">{hit.number + '.'}</td>
                                            <td className="nowrap-ellipsis"
                                                title={`${hit.id} ${hit.title}`}
                                                data-toggle="tooltip" data-placement="left">
                                                <a href={barLinks[0]}
                                                    className="btn-link">{hit.id} {hit.title}</a>
                                            </td>
                                            {hasName &&
                                                <td className="nowrap-ellipsis" title={hit.sciname}
                                                    data-toggle="tooltip" data-placement="top">
                                                    {hit.sciname}
                                                </td>
                                            }
                                            {!this.props.imported_xml && <td className="text-right">{hit.qcovs}</td>}
                                            <td className="text-right">{hit.total_score}</td>
                                            <td className="text-right">{this.inExponential(hit.hsps[0].evalue)}</td>
                                            <td className="text-right">{this.inPercentage(hit.hsps[0].identity, hit.hsps[0].length)}</td>
                                            {barLinks.length === 0?
                                            <td colSpan={2} className="text-center">
                                                N/A
                                            </td>
                                            :barLinks.map((barLink,idx)=>
                                            barLink.includes('efpWeb')?
                                                <td colSpan={2/barLinks.length} className="text-center" key={`efp-${idx}`}>
                                                    <a href={barLink}>eFP</a>
                                                </td>:<td colSpan={2/barLinks.length} className="text-center" key={`eplant-${idx}`}>
                                                    <a href={barLink}>ePlant</a>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                }, this))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});
